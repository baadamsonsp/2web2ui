import React, { Fragment } from 'react';
import { Page, Tag, UnstyledLink, ActionList, Popover, Select, Panel, Button, Label, TextField, Grid } from '@sparkpost/matchbox';
import { Add } from '@sparkpost/matchbox-icons'
import { LabelledValue, Unit } from 'src/components'
import { Typeahead } from 'src/components/typeahead/Typeahead';

import styles from '../DetailsPage.module.scss';

export const VariantsPanels = ({ test, formValues }) => {
  const isNotEditable = test.status === 'running' || test.status === 'cancelled' || test.status === 'completed';
  if (isNotEditable) {
    return (
      <Fragment>
        <Panel>
          <Panel.Section actions={[{ content: 'View Template', color: 'orange' }]}>
            <h6 className={styles.SmallHeader}>Default Template</h6>
            <LabelledValue label='Template ID'>
              <h6>{test.default_template.template_id}</h6>
            </LabelledValue>
            { test.default_template.sample_size &&
              <LabelledValue label='Sample Size'><p><Unit unit='number' value={test.default_template.sample_size}/></p></LabelledValue>
            }
            { test.default_template.percent &&
              <LabelledValue label='Percent'><p><Unit unit='percent' value={test.default_template.percent}/></p></LabelledValue>
            }
          </Panel.Section>
        </Panel>
        <Panel>
          {
            test.variants.map(({ template_id, sample_size, percent}, i) => (
              <Panel.Section actions={[{ content: 'View Template', color: 'orange' }]} key={i}>
                <LabelledValue label='Template ID' value={template_id} />
                {sample_size && <LabelledValue label='Sample Size'><p><Unit unit='number' value={sample_size}/></p></LabelledValue>}
                {percent && <LabelledValue label='Percent'><p><Unit unit='percent' value={percent}/></p></LabelledValue>}
              </Panel.Section>
            ))
          }
        </Panel>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Panel>
        <Panel.Section>
          <h6 className={styles.SmallHeader}>Default Template</h6>
          <Grid>
            <Grid.Column>
              <Typeahead name='default_variant' results={['template-1', 'template-2']} label='Select a Default template'/>
            </Grid.Column>
            <Grid.Column>
              <TextField label={(formValues && formValues.audience_selection === 'sample_size') ? 'Number of messages' : 'Percent of total'} suffix={formValues.audience_selection === 'percent' ? '%' : null}/>
            </Grid.Column>
          </Grid>
        </Panel.Section>
      </Panel>
      <Panel>
        <Panel.Section >
          <div style={{ float: 'right', marginBottom: '-1.1rem', position: 'relative', zIndex: 1 }}>
            <Button flat color='orange' size='small'>Remove</Button>
          </div>
          <h6 className={styles.SmallHeader}>Variant</h6>
          <Grid>
            <Grid.Column>
              <Typeahead name='variant2' results={['template-1', 'template-2']} label='Select a template' showClear={false} />
            </Grid.Column>
            <Grid.Column>
              <TextField label={(formValues && formValues.audience_selection === 'sample_size') ? 'Number of messages' : 'Percent of total'} suffix={formValues.audience_selection === 'percent' ? '%' : null}/>
            </Grid.Column>
          </Grid>
        </Panel.Section>


        <Panel.Section>
          <Button flat color='orange' size='small'><Add /> Add Another Variant</Button>
        </Panel.Section>

      </Panel>
    </Fragment>
  );
}
