export default [
  {
    id: 'payment-confirmation',
    name: 'Payment Confirmation',
    version: 2,
    status: 'scheduled',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_payment_confirmation_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'payment_confirmation_variant1',
        percent: 10
      },
      {
        template_id: 'payment_confirmation_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'password-reset',
    name: 'Password Reset Test',
    version: 1,
    status: 'cancelled',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_password_reset_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'password_reset_variant1',
        percent: 10
      },
      {
        template_id: 'password_reset_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'welcome-message',
    name: 'Welcome Message',
    version: 2,
    status: 'running',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_welcome-message_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'welcome-message_variant1',
        percent: 10
      },
      {
        template_id: 'welcome-message_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    winning_template_id: 'billing-alert_variant1',
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  }
]
