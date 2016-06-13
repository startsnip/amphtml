/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

global.assert = require('assert');

import {AmpAdNetworkAdSenseImpl} from '../amp-ad-network-adsense-impl';
import * as sinon from 'sinon';

describe('amp-ad-network-adsense-impl', () => {

  let sandbox;
  let adsenseImpl;
  let adsenseImplElem;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    adsenseImplElem = document.createElement('amp-ad-network-adsense-impl');
    adsenseImpl = new AmpAdNetworkAdSenseImpl(adsenseImplElem);
    sandbox.stub(AmpAdNetworkAdSenseImpl.prototype, 'isValidImplementation_')
      .returns(true);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#isValidElement', () => {
    it('should be valid', () => {
      const ampAdElem = document.createElement('amp-ad');
      adsenseImplElem.setAttribute('data-ad-client', 'adsense');
      ampAdElem.appendChild(adsenseImplElem);
      expect(adsenseImpl.isValidElement()).to.be.true;
    });
    it('should NOT be valid (missing parent)', () => {
      adsenseImplElem.setAttribute('data-ad-client', 'adsense');
      expect(adsenseImpl.isValidElement()).to.be.false;
    });
    it('should be NOT valid (missing ad client)', () => {
      const ampAdElem = document.createElement('amp-ad');
      ampAdElem.appendChild(adsenseImplElem);
      expect(adsenseImpl.isValidElement()).to.be.false;
    });
    it('should be NOT valid (non-amp-ad parent)', () => {
      const divElem = document.createElement('div');
      adsenseImplElem.setAttribute('data-ad-client', 'adsense');
      divElem.appendChild(adsenseImplElem);
      expect(adsenseImpl.isValidElement()).to.be.false;
    });
  });

  describe('#extractCreativeAndSignature', () => {
    it('without signature', done => {
      const creativeArrayBuffer =
        new TextEncoder('utf-8').encode('some creative');
      return adsenseImpl.extractCreativeAndSignature(
        creativeArrayBuffer,
        {
          get: function() {
            return undefined;
          },
        })
        .then(result => {
          expect(result).to.deep.equal(
            {creativeArrayBuffer, signature: undefined});
          done();
        })
        .catch(error => {
          assert.fail(error);
          done();
        });
    });
    it('with signature', done => {
      const creativeArrayBuffer =
        new TextEncoder('utf-8').encode('some creative');
      return adsenseImpl.extractCreativeAndSignature(
        creativeArrayBuffer,
        {get: function(name) {
          return name == 'X-AmpAdSignature' ? 'some_sig' : undefined;}})
        .then(result => {
          expect(result).to.deep.equal(
            {creativeArrayBuffer, signature: 'some_sig'});
          done();
        })
        .catch(error => {
          assert.fail(error);
          done();
        });
    });
  });
});
