/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />
namespace App {
  new Input();
  new ProjectList('active');
  new ProjectList('finished');
}
