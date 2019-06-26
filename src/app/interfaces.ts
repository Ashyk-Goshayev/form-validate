export interface Tile {
  name: string;
  about: string;
  price: number;
  image: string;
}
export interface Price {
  name: string;
  about: string;
  price: number;
  image: string;
}
export interface PeriodicElement {
  email: string;
  id: number;
  password: string;
  image: string;
}
export interface Transaction {
  id: number;
  image: string;
  name: string;
  price: number;
}
export interface Admin {
  email: string;
  password: string;
}
export interface User {
  id: number;
  email: string;
  password: string;
  image: any;
}
export interface List {
  position: number;
  email: string;
  password: string;
  delete: string;
  edit: string;
}
export interface Book {
  image: string;
  name: string;
  price: number;
  about: string;
  id: number;
}
