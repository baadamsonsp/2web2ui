import classnames from 'classnames/bind';
import Downshift from 'downshift';
import React, { Component } from 'react';
import { ActionList, Button, TextField } from '@sparkpost/matchbox';

import sortMatch from 'src/helpers/sortMatch';
import styles from './Typeahead.module.scss';

const cx = classnames.bind(styles);

export class Typeahead extends Component {
  static defaultProps = {
    name: 'subaccount'
  };

  typeaheadFn = ({
    getInputProps,
    getItemProps,
    getLabelProps,
    highlightedIndex,
    inputValue,
    openMenu,
    selectedItem,
    clearSelection,
    isOpen
  }) => {
    const { name, results, disabled, label, placeholder = (isOpen ? 'Type to search' : 'None'), error, helpText, itemToString, renderItem, showClear = true } = this.props;

    const matches = sortMatch(
      results,
      inputValue,
      itemToString
    );

    const mappedItems = (matches.length ? matches : results).map((item, index) => ({
      ...getItemProps({ item, index }),
      content: renderItem ? renderItem(item) : <div className={styles.Item}>{item}</div>,
      highlighted: highlightedIndex === index
    }));

    const listClasses = cx('List', {
      open: isOpen && (!inputValue || matches.length),
      hasHelp: !!helpText
    });

    const textFieldProps = getInputProps({
      connectRight: ((selectedItem && !disabled) && showClear) ? this.renderClearButton(clearSelection) : null,
      readOnly: !!selectedItem,
      disabled,
      id: name,
      label,
      name,
      placeholder,
      helpText,
      error: (!isOpen && error) ? error : null
    });

    textFieldProps['data-lpignore'] = true;

    return (
      <div className={cx('Typeahead')}>
        <ActionList className={listClasses} actions={mappedItems} />
        <TextField {...textFieldProps} onFocus={openMenu} />
      </div>
    );
  };

  renderClearButton(clearSelection) {
    const { clearText = 'Clear', showClear } = this.props;
    return <Button onClick={clearSelection}>{clearText}</Button>;
  }

  render() {
    const { itemToString, onChange, selectedItem } = this.props;

    return (
      <Downshift
        itemToString={itemToString}
        onChange={onChange}
        selectedItem={selectedItem}
      >
        {this.typeaheadFn}
      </Downshift>
    );
  }
}

Typeahead.defaultProps = {
  results: []
};
