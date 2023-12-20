import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  //Listado de gifs
  public gifList: Gif[] = [];
  //Listado del historial de busqueda
  private _tagsHistory: string[] = [];
  //Llave de seguridad de la API
  private apiKey: string = 'FJHO7ah24A5x69ZkCf0VubTz8NIVnufy';
  //URL de la API
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    console.log('Gifs Service Ready');
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    //Si el tag buscado ya está en el listado
    if (this._tagsHistory.includes(tag)) {
      //Lo elimino
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }
    //Lo pongo al inicio
    this._tagsHistory.unshift(tag);
    //Recorto el array a 10 elementos solamente
    this._tagsHistory = this.tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  //Guardo el array en localStorage
  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  //Metodo de busqueda a la api
  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '12')
      .set('q', tag);

    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
        // console.log({ gifs: this.gifList });
      });
  }
}
