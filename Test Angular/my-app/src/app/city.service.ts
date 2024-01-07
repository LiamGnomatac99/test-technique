import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { City } from './city';


@Injectable({ providedIn: 'root' })
export class CityService {

  private citiesUrl = 'api/cities';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET cities from the server */
  getCities(): Observable<City[]> {
    return this.http.get<City[]>(this.citiesUrl)
      .pipe(
        tap(_ => this.log('fetched cities')),
        catchError(this.handleError<City[]>('getCities', []))
      );
  }

  /** GET city by id. Return `undefined` when id not found */
  getCityNo404<Data>(id: number): Observable<City> {
    const url = `${this.citiesUrl}/?id=${id}`;
    return this.http.get<City[]>(url)
      .pipe(
        map(cities => cities[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} city id=${id}`);
        }),
        catchError(this.handleError<City>(`getCity id=${id}`))
      );
  }

  /** GET city by id. Will 404 if id not found */
  getCity(id: number): Observable<City> {
    const url = `${this.citiesUrl}/${id}`;
    return this.http.get<City>(url).pipe(
      tap(_ => this.log(`fetched city id=${id}`)),
      catchError(this.handleError<City>(`getCity id=${id}`))
    );
  }

  /* GET cities whose name contains search term */
  searchCities(term: string): Observable<City[]> {
    if (!term.trim()) {
      // if not search term, return empty city array.
      return of([]);
    }
    return this.http.get<City[]>(`${this.citiesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found cities matching "${term}"`) :
        this.log(`no cities matching "${term}"`)),
      catchError(this.handleError<City[]>('searchCities', []))
    );
  }

  //////// Save methods ////////

  /** POST: add a new city to the server */
  addCity(city: City): Observable<City> {
    return this.http.post<City>(this.citiesUrl, city, this.httpOptions).pipe(
      tap((newCity: City) => this.log(`added city w/ id=${newCity.id}`)),
      catchError(this.handleError<City>('addCity'))
    );
  }

  /** DELETE: delete the city from the server */
  deleteCity(id: number): Observable<City> {
    const url = `${this.citiesUrl}/${id}`;

    return this.http.delete<City>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted city id=${id}`)),
      catchError(this.handleError<City>('deleteCity'))
    );
  }

  /** PUT: update the city on the server */
  updateCity(city: City): Observable<any> {
    return this.http.put(this.citiesUrl, city, this.httpOptions).pipe(
      tap(_ => this.log(`updated city id=${city.id}`)),
      catchError(this.handleError<any>('updateCity'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a CityService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`CityService: ${message}`);
  }
}

