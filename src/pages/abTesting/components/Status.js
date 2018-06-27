import React from 'react';
import { Tag } from '@sparkpost/matchbox';
import { snakeToFriendly } from 'src/helpers/string';

const Status = ({ status }) => {
  let tagColor = null;

  if (status === 'running') {
    tagColor = 'yellow'
  }

  if (status === 'completed') {
    tagColor = 'blue'
  }

  return <Tag color={tagColor}>{snakeToFriendly(status)}</Tag>;
}

export default Status;
