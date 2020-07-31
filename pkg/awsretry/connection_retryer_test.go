package awsretry

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

import (
	"errors"
	"testing"

	"github.com/aws/aws-sdk-go/aws/request"
	"github.com/stretchr/testify/assert"
)

func TestConnectionErrRetryerShouldRetry(t *testing.T) {
	retryer := NewConnectionErrRetryer()
	sdkRequest := &request.Request{
		Error: errors.New("read: connection reset by peer"),
	}
	assert.True(t, retryer.ShouldRetry(sdkRequest))
}

func TestConnectionErrRetryerShouldNotRetryOtherErrors(t *testing.T) {
	retryer := NewConnectionErrRetryer()
	sdkRequest := &request.Request{
		Error: errors.New("random error"),
	}
	assert.False(t, retryer.ShouldRetry(sdkRequest))
}

func TestConnectionErrRetryerShouldNotRetryNoErrors(t *testing.T) {
	retryer := NewConnectionErrRetryer()
	sdkRequest := &request.Request{}
	assert.False(t, retryer.ShouldRetry(sdkRequest))
}
