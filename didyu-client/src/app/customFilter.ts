import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'customFilter',
    pure: false
})
export class MyFilterPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.status.indexOf(filter) !== -1);
    }
}


@Pipe({
    name: 'dateFilter',
    pure: false
})
export class DateFilterPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items || !filter) {
            return items;
        }
        // var custom = filter.getFullYear() + "-" + "0"+((filter.getMonth())+1) +"-"+ filter.getDate() + " 00:00:00"; ;
        var custom = moment(filter).format("YYYY-MM-DD"); 
        custom = custom + " 00:00:00";
        return items.filter(
            item => item.due_date.indexOf(custom) !== -1
        );
    }
}


@Pipe({
    name: 'titleFilter',
    pure: false
})
export class TitleFilterPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.title.indexOf(filter) !== -1);
    }
}


@Pipe({
    name: 'catFilter',
    pure: false
})
export class CategoryFilterPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.category_id.toString().indexOf(filter) !== -1);
    }
}