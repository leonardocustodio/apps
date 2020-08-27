// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LinkTypes } from '@polkadot/apps-config/links/types';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import linked from '@polkadot/apps-config/links';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  data: BN | number | string;
  hash?: string;
  isSmall?: boolean;
  type: LinkTypes;
}

// function shortName (name: string): string {
//   return `${name[0]}${name[name.length - 1]}`;
// }

function genLinks (systemChain: string, { data, hash, type }: Props): React.ReactNode[] {
  return Object
    .entries(linked)
    .map(([name, { chains, create, isActive, paths, url }]): React.ReactNode | null => {
      const extChain = chains[systemChain];
      const extPath = paths[type];

      if (!isActive || !extChain || !extPath) {
        return null;
      }

      return (
        <a
          href={create(extChain, extPath, data, hash)}
          key={name}
          rel='noopener noreferrer'
          target='_blank'
          title={`${name}, ${url}`}
        >
          {name}
        </a>
      );
    })
    .filter((node): node is React.ReactNode => !!node);
}

function LinkExternal ({ className = '', data, hash, isSmall, type }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { systemChain } = useApi();
  const links = useMemo(
    () => genLinks(systemChain, { data, hash, type }),
    [systemChain, data, hash, type]
  );

  if (!links.length) {
    return null;
  }

  return (
    <div className={`${className}${isSmall ? ' isSmall' : ''}`}>
      {!isSmall && <div>{t<string>('View this externally')}</div>}
      <div className='links'>{links.map((link, index) => <span key={index}>{link}</span>)}</div>
    </div>
  );
}

export default React.memo(styled(LinkExternal)`
  text-align: right;

  &.isSmall {
    font-size: 0.85rem;
    line-height: 1.35;
    text-align: center;
  }

  .links {
    span {
      word-wrap: normal;
      display: inline-block;
    }

    span+span {
      margin-left: 0.3rem;
    }
  }
`);
