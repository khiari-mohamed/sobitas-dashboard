export class BlogItem {
  _id: string;
  date: string;
  views: number;
  title: string;
  slug: string;
  img: string;

  constructor(_id: string, date: string, views: number, title: string, slug: string, img: string) {
    this._id = _id;
    this.date = date;
    this.views = views;
    this.title = title;
    this.slug = slug;
    this.img = img;
  }
}