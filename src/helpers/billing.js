import _ from 'lodash';
import config from 'src/config';

export function formatDataForCors(values) {
  const { email, planpicker, card, billingAddress } = values;

  // For CORS Endpoint + sift
  const corsData = {
    email,
    cardholder_name: card.name,
    address1: billingAddress.streetAddress,
    address2: null,
    city: null,
    state: billingAddress.state,
    country: billingAddress.country,
    zip_code: billingAddress.zip,
    bin: card.number.slice(0, 6),
    last_four: card.number.slice(-4),
    plan_id: planpicker.billingId
  };


  // For Zuora
  const billingData = {
    billingId: planpicker.billingId,
    billToContact: {
      firstName: billingAddress.firstName,
      lastName: billingAddress.lastName,
      workEmail: email,
      country: billingAddress.country,
      state: billingAddress.state
    },
    creditCard: {
      cardType: card.type,
      cardNumber: card.number,
      expirationMonth: card.expMonth,
      expirationYear: card.expYear,
      securityCode: card.securityCode,
      cardHolderInfo: {
        cardHolderName: card.name,
        addressLine1: billingAddress.streetAddress,
        addressLine2: null,
        city: null,
        zipCode: billingAddress.zip
      }
    }
  };

  return { corsData, billingData };
}

export function formatUpdateData({ accountKey, billingAddress, card }) {
  const { securityCode } = card;
  const { zip, country, state } = billingAddress;
  return {
    accountKey,
    defaultPaymentMethod: true,
    cardHolderInfo: {
      cardHolderName: card.name,
      addressLine1: billingAddress.streetAddress,
      addressLine2: null,
      city: null,
      zipCode: zip,
      country,
      state
    },
    creditCardNumber: card.number.replace(/\W/g, ''),
    expirationMonth: card.expMonth,
    expirationYear: card.expYear,
    securityCode,
    creditCardType: card.type
  };
}

export function formatCreateData({
  accountNumber,
  crmId,
  name,
  contractEffectiveDate,
  discountId = false,
  billingId,
  creditCard,
  billToContact
}) {
  const formatted = {
    accountNumber,
    autoPay: true,
    crmId,
    currency: 'USD',
    invoiceCollect: true,
    name,
    subscription: {
      contractEffectiveDate,
      subscribeToRatePlans: [{ productRatePlanId: billingId }],
      termType: 'EVERGREEN'
    },
    creditCard,
    billToContact
  };

  if (discountId) {
    formatted.subscription.subscribeToRatePlans.push({ productRatePlanId: discountId });
  }

  return formatted;
}

// Formats countries before storing in state
export function formatCountries(countries) {
  const ordered = _.flatten([
    _.remove(countries, { code: 'US' }),
    _.remove(countries, { code: 'GB' }),
    _.remove(countries, { code: 'CA' }),
    countries
  ]);

  return ordered.map((country) => formatForSelect(country));
}

function formatForSelect({ code, name, states }) {
  if (states) {
    return { value: code, label: name, states: states.map((state) => formatForSelect(state)) };
  }
  return { value: code, label: name };
}

export function getZipLabel(country) {
  if (country === 'US') {
    return 'Zip Code';
  }

  if (country === 'CA') {
    return 'Postal Code';
  }

  return 'Zip/Postal Code';
}

/**
 * Reshapes type strings from what the payment lib provides to a format our api accepts
 */
export function formatCardTypes(cards) {
  return cards.map((card) => {
    const type = _.find(config.cardTypes, { paymentFormat: card.type });
    return { ...card, type: type ? type.apiFormat : card.type };
  });
}