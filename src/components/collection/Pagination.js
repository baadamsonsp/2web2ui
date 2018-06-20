import React, { Component } from 'react';
import { Pagination, Button } from '@sparkpost/matchbox';
import classnames from 'classnames';
import styles from './Pagination.module.scss';
import Papa from 'papaparse';
import _ from 'lodash';
import csv from 'csvtojson';

export const defaultPerPageButtons = [10, 25, 50, 100];
const coordinates = [];
export { getCoords };
function getCoords() {
  return coordinates;
}
class CollectionPagination extends Component {
  formatToCsv = () => {
    const { data: rows } = this.props;
    // we are doing this because certain keys are objects/array which papa parse doesn't stringify
    const mappedRows = _.map(rows, (row) => _.mapValues(row, (value) => _.isObject(value) || _.isArray(value) ? JSON.stringify(value) : value));
    const data = Papa.unparse(mappedRows);
    csv({
      noheader: false,
      output: 'csv'
    })
      .fromString(data)
      .then((csvRow) => {
        csvRow.forEach(function (row) {
          try {
            const location = JSON.parse(row[5]);
            coordinates.push({ campaign_id: row[0],latitute: location.latitude,longtitude: location.longitude });
          } catch (e) {
            //console.log(e); // error in the above string (in this case, yes)!
          }
        });
        if (coordinates.length === 0) {
          coordinates.push({ campaign_id: 101,latitute: 40,longtitude: -70 });
        }
        console.log(getCoords()); // eslint-disable-line
      });


    return `data:text/csv;charset=utf-8,${encodeURI(data)}`;
  }

  renderCSVSave() {
    const now = Math.floor(Date.now() / 1000);
    if (!this.props.saveCsv) {
      return null;
    }

    return <Button download={`sparkpost-csv-${now}.csv`} to={this.formatToCsv()}>Save As CSV</Button>;
  }

  renderPageButtons() {
    const { data, perPage, currentPage, pageRange, onPageChange } = this.props;

    if (data.length <= perPage) {
      return null;
    }

    return (
      <Pagination
        pages={Math.ceil(data.length / perPage)}
        pageRange={pageRange}
        currentPage={currentPage}
        onChange={onPageChange}
      />
    );
  }

  renderPerPageButtons() {
    const { data, perPage, perPageButtons, onPerPageChange } = this.props;

    if (data.length <= Math.min(...perPageButtons)) {
      return null;
    }

    return (
      <Button.Group><span style={{
        fontSize: '80%',
        textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.5)',
        display: 'inline-block',
        marginRight: '10px'
      }}>Per Page</span>
      {perPageButtons.map((buttonAmount) => (
        <Button
          className={classnames(perPage === buttonAmount && styles.Selected)}
          key={buttonAmount}
          onClick={() => onPerPageChange(buttonAmount)}
        >{buttonAmount}</Button>
      ))}
      </Button.Group>
    );
  }

  render() {
    if (!this.props.currentPage) { return null; }

    return (
      <div>
        <div className={styles.PageButtons}>
          {this.renderPageButtons()}
        </div>
        <div className={styles.PerPageButtons}>
          {this.renderPerPageButtons()}
          {this.renderCSVSave()}
        </div>
      </div>
    );
  }
}

CollectionPagination.defaultProps = {
  pageRange: 5,
  perPageButtons: defaultPerPageButtons,
  saveCsv: true
};

export default CollectionPagination;
