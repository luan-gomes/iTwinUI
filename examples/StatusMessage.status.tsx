/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';
import { StatusMessage, Flex } from '@itwin/itwinui-react';
import { SvgPlaceholder } from '@itwin/itwinui-icons-react';

export default () => {
  return (
    <Flex flexDirection='column' gap='m'>
      <StatusMessage startIcon={<SvgPlaceholder />} status='positive'>
        Positive message
      </StatusMessage>
      <StatusMessage startIcon={<SvgPlaceholder />} status='warning'>
        Warning message
      </StatusMessage>
      <StatusMessage startIcon={<SvgPlaceholder />} status='negative'>
        Negative message
      </StatusMessage>
    </Flex>
  );
};
