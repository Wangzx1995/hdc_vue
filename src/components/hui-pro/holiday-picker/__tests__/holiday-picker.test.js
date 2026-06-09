/**
 * @author jiangyan6
 * @date 2020-06-08 10:38:13
 * @Last Modified by: jiangyan6
 * @Last Modified time: 2020-06-11 11:52:38
 * @desc holiday-picker 测试用例
 */
import { createVue, destroyVM, waitImmediate } from '@/jest/test-utils';

describe('HolidayPicker 节假日设置控件', () => {
  let vm;
  // 定义全局变量，作为测试数据
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  let currentMonthStr;
  if (currentMonth < 9) {
    currentMonthStr = '0' + (1 + currentMonth);
  } else {
    currentMonthStr += '';
  }
  let currentDateStr;
  if (currentDate < 10) {
    currentDateStr = '0' + currentDate;
  } else {
    currentDateStr += '';
  }
  const currentHolidayList = [
    `${currentYear}-${currentMonthStr}-${currentDateStr}`
  ];
  afterEach(() => {
    destroyVM(vm);
  });

  it('snapshot test', () => {
    vm = createVue({
      template: `
        <h-holiday-picker></h-holiday-picker>
      `
    });
    expect(vm.$el.outerHTML).toMatchSnapshot();
  });

  it('create', () => {
    vm = createVue({
      template: `
        <h-holiday-picker></h-holiday-picker>
      `
    });
    expect(vm.$el.classList.contains('h-perpetual-calendar')).toBeTruthy();
  });

  it('holiday-list', async () => {
    vm = createVue({
      template: `
        <h-holiday-picker ref="holidayPicker" :holidayList="currentHolidayList"></h-holiday-picker>
      `,
      data() {
        return {
          currentHolidayList: currentHolidayList
        };
      }
    });
    const holidayElementText = parseInt(
      vm.$el.querySelector('.holiday .solar-date').textContent
    );
    // 假期的格子，内容要跟currentHolidayList里面的日期对上
    expect(vm.$refs.holidayPicker.currentYear).toBe(currentYear);
    expect(vm.$refs.holidayPicker.currentMonth).toBe(currentMonth);
    expect(vm.$refs.holidayPicker.currentDate).toBe(currentDate);
    expect(holidayElementText).toBe(currentDate);
  });

  it('first-day-of-week', async () => {
    vm = createVue({
      template: `
        <h-holiday-picker ref="holidayPicker" :first-day-of-week="1"></h-holiday-picker>
      `
    });
    const firstDayOfWeek = vm.$el
      .querySelector('.week-wrapper .week-day')
      .textContent.replace(/\s+/g, '');
    // 星期一栏的第一列里面的内容要显示为对应的内容，1-7对应星期一-星期日
    expect(firstDayOfWeek).toBe('星期一');
  });

  it('text', async () => {
    const text = '假';
    vm = createVue({
      template: `
        <h-holiday-picker ref="holidayPicker" :holidayList="currentHolidayList" :text="text"></h-holiday-picker>
      `,
      data() {
        return {
          currentHolidayList: currentHolidayList,
          text: text
        };
      }
    });
    const holidayElementText = vm.$el
      .querySelector('.holiday .status')
      .textContent.replace(/\s+/g, '');
    // 设置为假期的日期格子中，文本展示为'假'
    expect(holidayElementText).toBe(text);
  });

  it('readonly', async () => {
    vm = createVue({
      template: `
        <h-holiday-picker ref="holidayPicker" :holidayList="currentHolidayList" readonly></h-holiday-picker>
      `,
      data() {
        return {
          currentHolidayList: currentHolidayList
        };
      }
    });
    const dateItemWrapeprCursorStyle = vm.$el.querySelector(
      '.today .date-item-wrapper'
    ).style.cursor;
    // 所有日期格子上都有cursor: auto的样式
    expect(dateItemWrapeprCursorStyle).toBe('auto');
    // 点击日期格子不会修改信息
    const holidayItem = vm.$el.querySelector('.holiday');
    const oldHolidayItemText = holidayItem
      .querySelector('.status')
      .textContent.replace(/\s+/g, '');
    holidayItem.click();
    const newHolidayItemText = holidayItem
      .querySelector('.status')
      .textContent.replace(/\s+/g, '');
    expect(newHolidayItemText).toBe(oldHolidayItemText);
  });

  it('cell-height', async () => {
    const cellHeight = 120;
    vm = createVue({
      template: `
        <h-holiday-picker ref="holidayPicker" :holidayList="currentHolidayList" :cell-height="cellHeight"></h-holiday-picker>
      `,
      data() {
        return {
          currentHolidayList: currentHolidayList,
          cellHeight: cellHeight
        };
      }
    });
    const dateItemWrapeprHeightStyle = vm.$el.querySelector(
      '.today .date-item-wrapper'
    ).style.height;
    // 所有日期格子上都有height，且值为传入的数字+‘px’
    expect(dateItemWrapeprHeightStyle).toBe(`${cellHeight}px`);
  });

  it('dateClick', async () => {
    vm = createVue({
      template: `
        <h-holiday-picker ref="holidayPicker" :holidayList="currentHolidayList" @dateClick="dateClickHandler"></h-holiday-picker>
      `,
      data() {
        return {
          currentHolidayList: currentHolidayList,
          clickedDateInfo: null
        };
      },
      methods: {
        dateClickHandler(dateInfo) {
          this.clickedDateInfo = dateInfo;
        }
      }
    });
    const dateItem = vm.$el.querySelector('.today .date-item-wrapper');
    dateItem.click();
    // 点击后，clickedDateInfo为被点击的dateItem信息
    expect('dateItem' in vm.clickedDateInfo).toBe(true);
    expect('holidayList' in vm.clickedDateInfo).toBe(true);
  });

  it('dateChange', async () => {
    vm = createVue({
      template: `
        <h-holiday-picker ref="holidayPicker" :holidayList="currentHolidayList" @dateChange="dateChangeHandler"></h-holiday-picker>
      `,
      data() {
        return {
          currentHolidayList: [],
          holidayList: null
        };
      },
      methods: {
        dateChangeHandler(holidayList) {
          this.holidayList = holidayList;
        }
      }
    });
    const dateItem = vm.$el.querySelector('.today .date-item-wrapper');
    const index = Array.prototype.findIndex.call(
      document.querySelector('.today').parentElement.childNodes,
      function(item) {
        return item.classList.contains('today');
      }
    );
    const nextTrDateItem = document
      .querySelector('.today')
      .parentElement.nextElementSibling.childNodes[index].querySelector(
        '.date-item-wrapper'
      );
    const mousedownEvent = new MouseEvent('mousedown', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    dateItem.dispatchEvent(mousedownEvent);
    const mouseenterEvent = new MouseEvent('mouseenter', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    nextTrDateItem.dispatchEvent(mouseenterEvent);
    const mouseupEvent = new MouseEvent('mouseup', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    nextTrDateItem.dispatchEvent(mouseupEvent);
    // 拖拽后，holidayList为当前被选中的日期列表
    expect(vm.holidayList.length).toBe(8);
  });

  it('calendarChange', async () => {
    vm = createVue({
      template: `
        <h-holiday-picker ref="holidayPicker" :holidayList="currentHolidayList" @calendarChange="calendarChangeHandler"></h-holiday-picker>
      `,
      data() {
        return {
          currentHolidayList: [],
          currentYear: '',
          currentMonth: ''
        };
      },
      methods: {
        calendarChangeHandler(currentYear, currentMonth) {
          this.currentYear = currentYear;
          this.currentMonth = currentMonth;
        }
      }
    });
    const prevYearBtn = vm.$el.querySelector(
      '.year-month-operate-bar .prev-year'
    );
    prevYearBtn.click();
    await waitImmediate();
    // 切换日期后，currentYear、currentMonth要发生变化
    expect(vm.currentYear).not.toBe('');
    expect(vm.currentMonth).not.toBe('');
  });
});
