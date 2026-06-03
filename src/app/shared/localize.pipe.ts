import { Pipe, PipeTransform, inject } from '@angular/core';
import { PortfolioService } from '../services/portfolio.service';
import { LocalizedString } from '../models/portfolio.model';

/**
 * Resolves a LocalizedString to the currently active locale.
 * Pure: false so it re-evaluates when the locale signal changes.
 *
 *   {{ project.description | localize }}
 */
@Pipe({ name: 'localize', standalone: true, pure: false })
export class LocalizePipe implements PipeTransform {
  private svc = inject(PortfolioService);

  transform(value: LocalizedString | null | undefined): string {
    if (!value) return '';
    return value[this.svc.locale()] ?? value.en ?? '';
  }
}

/**
 * Converts simple **bold** markers to <strong> for highlight metrics.
 * Used with [innerHTML]. Input is plain data we control (not user input).
 */
@Pipe({ name: 'mdBold', standalone: true })
export class MdBoldPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
}
