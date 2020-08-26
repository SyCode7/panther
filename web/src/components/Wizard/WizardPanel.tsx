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
import { Box, Button, FadeIn, Flex, Heading, IconButton, Text } from 'pouncejs';
import { useWizardContext } from './WizardContext';

interface WizardPanelAction {
  disabled?: boolean;
}

interface WizardPanelHeadingProps {
  title: string | React.ReactNode | React.ReactNode[];
  subtitle?: string | React.ReactNode | React.ReactNode[];
}

interface WizardPanelComposition {
  Actions: React.FC;
  ActionNext: React.FC<WizardPanelAction>;
  ActionPrev: React.FC<WizardPanelAction>;
  Heading: React.FC<WizardPanelHeadingProps>;
}

const WizardPanel: React.FC & WizardPanelComposition = ({ children }) => {
  return (
    <Box as="section" width={700} mx="auto">
      <FadeIn>{children}</FadeIn>
    </Box>
  );
};

const WizardPanelHeading: React.FC<WizardPanelHeadingProps> = ({ title, subtitle }) => (
  <Box as="header" mb={10} textAlign="center">
    <Heading size="small" mb={2} fontWeight="medium">
      {title}
    </Heading>
    {!!subtitle && (
      <Text fontSize="medium" color="gray-300">
        {subtitle}
      </Text>
    )}
  </Box>
);

const WizardPanelActions: React.FC = ({ children }) => {
  return (
    <Flex justify="center" mt={8} mb={4}>
      {children}
    </Flex>
  );
};

const WizardPanelActionPrev: React.FC<WizardPanelAction> = ({ disabled }) => {
  const { goToPrevStep } = useWizardContext();
  return (
    <Box position="absolute" top={6} left={6}>
      <IconButton
        disabled={disabled}
        icon="arrow-back"
        variantColor="navyblue"
        aria-label="Go Back"
        onClick={goToPrevStep}
      />
    </Box>
  );
};

const WizardPanelActionNext: React.FC<WizardPanelAction> = ({ disabled, children }) => {
  const { goToNextStep } = useWizardContext();
  return (
    <Button onClick={goToNextStep} disabled={disabled}>
      {children || 'Next'}
    </Button>
  );
};

WizardPanel.Actions = React.memo(WizardPanelActions);
WizardPanel.ActionPrev = React.memo(WizardPanelActionPrev);
WizardPanel.ActionNext = React.memo(WizardPanelActionNext);
WizardPanel.Heading = React.memo(WizardPanelHeading);

export default WizardPanel;