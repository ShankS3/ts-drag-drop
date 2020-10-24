import { autobind } from '../decorators/autobind';
import { projectState } from '../state/project-state';
import { Validatable, validate } from '../utils/validation';
import BaseComponent from './base-component';

export default class Input extends BaseComponent<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() {}

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
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}
