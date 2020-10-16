//autobind decorator
function autobind(
  _: any, 
  _2: string, 
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptior: PropertyDescriptor = {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    }
  };

  return adjDescriptior;
}

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  if(validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if(
    validatableInput.minLength != null && 
    typeof validatableInput.value === 'string'
  ) {
    isValid = isValid && validatableInput.value.length > validatableInput.minLength;
  }
  if(
    validatableInput.maxLength != null && 
    typeof validatableInput.value === 'string'
  ) {
    isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
  }
  if(
    validatableInput.min != null && 
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value > validatableInput.min;
  }
  if(
    validatableInput.max != null && 
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value < validatableInput.max
  }

  return isValid;
}

class Input {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement; 
  
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private fetchUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const description = this.descriptionInputElement.value;
    const people = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: title,
      required: true
    }

    const descValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 5
    }

    const peopleValidatable: Validatable = {
      value: people,
      required: true,
      min: 1
    }

    if(
      !validate(titleValidatable) || 
      !validate(descValidatable) || 
      !validate(peopleValidatable)
    ) {
      alert('Invalid input, please try again!');
      return;
    } else {
      return [title, description, +people]
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event){
    event.preventDefault();
    const userInput = this.fetchUserInput();
    if(Array.isArray(userInput)) {
      const [title, desc, people ] = userInput;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach()  {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const projectInput = new Input();
