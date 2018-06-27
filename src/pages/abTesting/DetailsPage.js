import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Tag, UnstyledLink, ActionList, Popover, Select, Panel, Button } from '@sparkpost/matchbox';
import { ExpandMore } from '@sparkpost/matchbox-icons';
import { Unit, LabelledValue } from 'src/components'
import Section from './components/Section';
import Status from './components/Status';

import { snakeToFriendly } from 'src/helpers/string';
import styles from './DetailsPage.module.scss';

import data from './data'; // fake data
import _ from 'lodash';

{/* <LabelledValue label='Version'>
  {
    test.version > 1
    ? <Select size='small' options={_.times(test.version, (i) => i + 1)}/>
    : <p>{test.version}</p>
  }
</LabelledValue> */}

const VersionSelector = ({ version }) => {

  if (version > 1) {
    const actions = _.times(version, (i) => ({ content: `View Version ${i + 1}`, visible: i + 1 !== version })).reverse();
    return (
      <Popover left trigger={<React.Fragment>Viewing Version {version}<ExpandMore/></React.Fragment>}>
        <ActionList actions={actions}/>
      </Popover>
    )
  }

  return <React.Fragment>Version: {version}</React.Fragment>;
}

class DetailPage extends Component {

  render() {
    const { test } = this.props;

    return (
      <Page
        title={test.name}
        breadcrumbAction={{ content: 'All Tests', component: Link, to: '/ab-testing' }}
        primaryAction={{ content: 'Create a New Test'}}
        secondaryActions={[
          { content: 'Cancel Test' },
          { content: 'Delete Test' }
        ]}>

        <Section title='Status'>
          <Section.Left>1</Section.Left>
          <Section.Right>
            <Panel>
              <Panel.Section actions={[{ content: <VersionSelector version={test.version} />, color: 'orange' }]}>
                <LabelledValue label='Status'>
                  <Status status={test.status} />
                </LabelledValue>
                <LabelledValue label='Test ID' value={test.id} />
              </Panel.Section>
            </Panel>
          </Section.Right>
        </Section>

        <Section title='Test Settings'>
          <Section.Left>2</Section.Left>
          <Section.Right>
            <Panel>
              <Panel.Section >
                <LabelledValue label='Test Mode' ><p>{snakeToFriendly(test.test_mode)} </p></LabelledValue>
                <LabelledValue label='Audience' ><p>{snakeToFriendly(test.audience_selection)} </p></LabelledValue>
                <LabelledValue label='Metric' ><p>{snakeToFriendly(test.metric)} </p></LabelledValue>
                <LabelledValue label='Timeout' ><p>{`${test.engagement_timeout} hours`} </p></LabelledValue>

              </Panel.Section>
            </Panel>
          </Section.Right>
        </Section>

        <Section title='Variants'>
          <Section.Left>3</Section.Left>
          <Section.Right>
            <Panel>
              <Panel.Section actions={[{ content: 'View Template', color: 'orange' }]}>
                <LabelledValue label='Template ID'>
                  <h6>{test.default_template.template_id}</h6>
                  <small className={styles.Default}>Default Template</small>
                </LabelledValue>
                { test.default_template.sample_size &&
                  <LabelledValue label='Sample Size'><p><Unit unit='number' value={test.default_template.sample_size}/></p></LabelledValue>
                }
                { test.default_template.percent &&
                  <LabelledValue label='Percent'><p><Unit unit='percent' value={test.default_template.percent}/></p></LabelledValue>
                }
              </Panel.Section>
            </Panel>
            {
              test.variants.map(({ template_id, sample_size, percent}, i) => (
                <Panel key={i}>
                  <Panel.Section actions={[{ content: 'View Template', color: 'orange' }]}>
                    <LabelledValue label='Template ID' value={template_id} />
                    {sample_size && <LabelledValue label='Sample Size'><p><Unit unit='number' value={sample_size}/></p></LabelledValue>}
                    {percent && <LabelledValue label='Percent'><p><Unit unit='percent' value={percent}/></p></LabelledValue>}
                  </Panel.Section>
                </Panel>
              ))
            }
          </Section.Right>
        </Section>

      </Page>
    );
  }
}

const mapStateToProps = (state, props) => ({
    test: _.find(data, { id: props.match.params.id })
});

export default connect(mapStateToProps, {})(DetailPage);
