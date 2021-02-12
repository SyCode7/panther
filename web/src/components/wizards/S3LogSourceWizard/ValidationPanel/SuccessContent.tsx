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

import { useWizardContext, WizardPanel } from 'Components/Wizard';
import { AbstractButton, Button, Flex, Img, Link, SimpleGrid, Spinner } from 'pouncejs';
import SuccessStatus from 'Assets/statuses/success.svg';
import LinkButton from 'Components/buttons/LinkButton';
import urls from 'Source/urls';
import React from 'react';
import { Link as RRLink } from 'react-router-dom';
import { useFormikContext } from 'formik';
import { S3LogSourceWizardValues } from 'Components/wizards/S3LogSourceWizard/S3LogSourceWizard';
import { useGetS3LogSourceLazyQuery } from 'Pages/EditS3LogSource/graphql/getS3LogSource.generated';
import HealthCheckWarning from './HealthCheckWarning';

interface SuccessContentProps {
  integrationId: string;
}

const SuccessContent: React.FC<SuccessContentProps> = ({ integrationId }) => {
  const { reset: resetWizard } = useWizardContext();
  const { initialValues, resetForm } = useFormikContext<S3LogSourceWizardValues>();

  const [getS3, { data, loading }] = useGetS3LogSourceLazyQuery({
    fetchPolicy: 'network-only', // Don't use cache
    variables: { id: integrationId },
  });

  React.useEffect(() => {
    getS3();
  }, []);

  if (loading || !data) {
    return (
      <Flex align="center" justify="center" height={380}>
        <Spinner />
      </Flex>
    );
  }

  const {
    processingRoleStatus,
    getObjectStatus,
    kmsKeyStatus,
    s3BucketStatus,
  } = data?.getS3LogIntegration.health;

  const healthChecks = [processingRoleStatus, kmsKeyStatus, s3BucketStatus];
  if (getObjectStatus) {
    healthChecks.push(getObjectStatus);
  }
  const isHealthy = healthChecks.every(healthMetric => Boolean(healthMetric.healthy));

  if (!isHealthy) {
    return (
      <WizardPanel>
        <Flex align="center" direction="column" mx="auto" width={675}>
          <WizardPanel.Heading
            title="The source is saved, but there are some issues blocking log integration"
            subtitle="Have a look at the error(s) below and try again. If the problem continues, contact us."
          />
          <SimpleGrid column={1} spacing={2}>
            {healthChecks
              .filter(hc => !hc.healthy)
              .map(hc => {
                return hc.message?.length || hc.rawErrorMessage ? (
                  <HealthCheckWarning
                    key={hc.message}
                    title={hc.message}
                    description={hc.rawErrorMessage}
                  />
                ) : null;
              })}
          </SimpleGrid>
          <WizardPanel.Actions>
            <Flex direction="column" align="center" spacing={4}>
              <Button onClick={() => getS3()}>Retry Healthcheck</Button>
              {!initialValues.integrationId && (
                <Link
                  as={RRLink}
                  variant="discreet"
                  to={urls.logAnalysis.sources.edit(integrationId, 's3')}
                >
                  Edit Source Info
                </Link>
              )}
            </Flex>
          </WizardPanel.Actions>
        </Flex>
      </WizardPanel>
    );
  }
  return (
    <WizardPanel>
      <Flex align="center" direction="column" mx="auto" width={375}>
        <WizardPanel.Heading
          title="Everything looks good!"
          subtitle={
            initialValues.integrationId
              ? 'Your stack was successfully updated'
              : 'Your configured stack was deployed successfully and Panther now has permissions to pull data!'
          }
        />
        <Img
          nativeWidth={120}
          nativeHeight={120}
          alt="Stack deployed successfully"
          src={SuccessStatus}
        />
        <WizardPanel.Actions>
          <Flex direction="column" spacing={4}>
            <LinkButton to={urls.logAnalysis.sources.list()}>Finish Setup</LinkButton>
            {!initialValues.integrationId && (
              <Link
                as={AbstractButton}
                variant="discreet"
                onClick={() => {
                  resetForm();
                  resetWizard();
                }}
              >
                Add Another
              </Link>
            )}
          </Flex>
        </WizardPanel.Actions>
      </Flex>
    </WizardPanel>
  );
};

export default React.memo(SuccessContent);
