namespace App {
  export function autobind(
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
}