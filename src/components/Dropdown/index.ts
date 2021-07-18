import Dropdown from './Dropdown.vue';

enum DropdownEmits {
    Changed = 'Changed',
}

interface IOption {
    label: string;
    value: string;
}

export { Dropdown as default, DropdownEmits, IOption };
