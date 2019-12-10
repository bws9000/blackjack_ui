export default class Table {
  _id:string;
  displayname:string;
  name:string;
  creator:string;
  date:string;

  static fromJSON(json: any): Table {
    let object = Object.create(Table.prototype);
    Object.assign(object, json);
    return object;
  }

}
