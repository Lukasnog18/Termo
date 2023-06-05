import { Component, HostListener } from '@angular/core';
import { WordService } from './word.service';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export enum Key {
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  Backspace = 'Backspace',
  Enter = 'Enter',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [WordService]
})
export class AppComponent {
  title = 'termo-web';
  currentRow = 0;
  success = false;

  constructor(private service: WordService) { }

  onClick(event: Event) {
    if(!this.success) {
      var div = event.target as HTMLElement;

      if(div.parentElement?.getAttribute('row') == this.currentRow.toString()) {
        div.parentElement?.querySelector('.edit')?.classList.remove('edit');
        div?.classList.add('edit');
      }
    }
  }

  onKeyClick(event: Event) {
    if(!this.success) {
      var div = event.target as HTMLElement;
      var letter = div.getAttribute('keyboard-key') ?? '';
      //console.log(key);

      if(/[a-zA-Z]/.test(letter) && letter.length == 1) {
        this.setCurrentPositionValue(letter);
        this.moveRight();
      } else if(letter == Key.ArrowRight){
          this.moveRight();
      } else if(letter == Key.ArrowLeft){
          this.moveLeft();
      } else if(letter == Key.Backspace){
          if(document.querySelector('.edit')?.innerHTML == ''){
            this.moveLeft();
          }
          this.setCurrentPositionValue();
      } else if(letter == Key.Enter){
        //this.sendWord();
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if(!this.success) {
      var key = event.key;
      //console.log(key);

      if(/[a-zA-Z]/.test(key) && key.length == 1) {
        this.setCurrentPositionValue(key);
        this.moveRight();
      } else if(key == Key.ArrowRight){
          this.moveRight();
      } else if(key == Key.ArrowLeft){
          this.moveLeft();
      } else if(key == Key.Backspace){
          if(document.querySelector('.edit')?.innerHTML == ''){
            this.moveLeft();
          }
          this.setCurrentPositionValue();
      } else if(key == Key.Enter){
        //this.sendWord();
      }
    }
  }

  setCurrentPositionValue(value: string = '') {
    document.querySelector('.edit')?.replaceChildren(value);
  }

  moveRight() {
    var index = Number(document.querySelector('.edit')?.getAttribute('pos'));

    if(index < 4) {
      document.querySelector('.edit')?.parentElement?.children.item(index + 1)?.classList.add('edit');
      document.querySelector('.edit')?.classList.remove('edit');
    }
  }

  moveLeft() {
    var index = Number(document.querySelector('.edit')?.getAttribute('pos'));

    if(index > 0) {
      document.querySelector('.edit')?.parentElement?.children.item(index - 1)?.classList.add('edit');
      document.querySelectorAll('.edit')[1].classList.remove('edit');
    }
  }

  sendWord() {
    var word = this.getWord();

    if(word.length < 5) {

    } else {
      this.getValidations(word.toLocaleLowerCase());
    }

  }

  getWord(){
    var word = '';

    const row = document.querySelector(`[row="${this.currentRow}"]`);
    if(row != undefined){
      for(let index = 0; index < row?.children.length; index++) {
        const letter = row?.children.item(index)?.innerHTML;
        if(letter != undefined)
          word += letter;
      }
    }

    return word;
  }

  getValidations(word: string) {
    this.service.getValidations(word)
    .pipe(catchError((error: HttpErrorResponse) => {
      return throwError(() => null)
    }))
    .subscribe(p => {
      var validations = p;
      const row = document.querySelector(`[row="${this.currentRow}"]`)

      for(let index = 0; index < validations.letters.length; index++) {
        var validationLetter = validations.letters[index];

        if(validationLetter.exists) {
          if(validationLetter.rightPlace) {
            row?.querySelector(`[pos="${index}"]`)?.classList.add('right');
          } else {
            row?.querySelector(`[pos="${index}"]`)?.classList.add('place');
          }
        }else {
          row?.querySelector(`[pos="${index}"]`)?.classList.add('wrong');
        }

      }
    })
  }

}


