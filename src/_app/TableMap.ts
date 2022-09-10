export class TableMap {
  displayName: string;
  public name:string;
  creator: string;
  createDate: Date;

  constructor(displayName: string) {
    this.displayName = displayName;
    this.creator = "Guest";
    this.createDate = new Date();
    this.name = this.setUnique()
  }

  getDisplayName(){
    return this.displayName;
  }

  getName(){
    return this.name;
  }

  setUnique(){
    return this.randomId(11);
  }

  randomId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //let characters = '0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
