import Cookbook from "./cookbook";
import Pantry from "./pantry";

class User {
  constructor(id, name, pantry) {
    this.id = id;
    this.name = name;
    this.pantry = new Pantry(pantry);
    this.cookbook = new Cookbook(this.id);
  }
}

export default User;
