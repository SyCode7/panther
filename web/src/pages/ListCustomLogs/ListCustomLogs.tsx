/**
 * Panther is a Cloud-Native SIEM for the Modern Security Team.
 * Copyright (C) 2020 Panther Labs Inc
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import { Alert, Flex } from 'pouncejs';
import urls from 'Source/urls';
import Panel from 'Components/Panel';
import LinkButton from 'Components/buttons/LinkButton';
import { compose } from 'Helpers/compose';
import withSEO from 'Hoc/withSEO';
import TablePlaceholder from 'Components/TablePlaceholder';
import { extractErrorMessage, slugify } from 'Helpers/utils';
import { useListCustomLogSchemas } from './graphql/listCustomLogSchemas.generated';
import CustomLogCard from './CustomLogCard';
import EmptyDataFallback from './EmptyDataFallback';

const ListCustomLogs: React.FC = () => {
  const { data, loading, error } = useListCustomLogSchemas();

  return (
    <Panel
      title="Custom Schemas"
      actions={
        <LinkButton to={urls.logAnalysis.customLogs.create()} icon="add">
          New Schema
        </LinkButton>
      }
    >
      {loading && <TablePlaceholder />}
      {error && (
        <Alert
          variant="error"
          title="Couldn't load your custom schemas"
          description={
            extractErrorMessage(error) ||
            'There was an error while attempting to list your custom schemas'
          }
        />
      )}
      {data &&
        (data.listCustomLogs.length > 0 ? (
          <Flex direction="column" spacing={4}>
            {data.listCustomLogs.map(customLog => (
              <CustomLogCard key={slugify(customLog.logType)} customLog={customLog} />
            ))}
          </Flex>
        ) : (
          <EmptyDataFallback />
        ))}
    </Panel>
  );
};

export default compose(withSEO({ title: 'Custom Schemas' }))(ListCustomLogs);
