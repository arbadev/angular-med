import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { TimerService } from './timer.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  providers: [TimerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit, OnDestroy {

  @Output() onComplete = new EventEmitter<void>();
  @Input() init = 20;
  private countdownEndSubscription: Subscription = null;
  private countdownSubscription: Subscription =  null;
  public countdown = 0;

  constructor(public timer: TimerService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.timer.restartCountdown(this.init);

    this.countdownEndSubscription = this.timer.countdownEnd$.subscribe(() => {
      console.log('--- countdown end ---');
      this.onComplete.emit();
    });

    this.countdownSubscription = this.timer.countdown$.subscribe((data) => {
      console.log('--- HAY countdown ---');
      this.countdown = data;
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy() {
    this.timer.destroy();
    this.countdownEndSubscription.unsubscribe();
    this.countdownSubscription.unsubscribe();
  }

  get progress() {
    return (this.init - (this.countdown)) / this.init * 100;
  }
}
