declare module 'FAQ';

const applicationFAQ = [
  {
    summary: 'How do I control the Terra-X9 through the app?',
    details: `You can control the Terra-X9 through the application, which
          provides a smooth steering and driving mode, and real-time
          video-overview. It includes features such as light control for
          night vision, image capturing and an image. Sapien vulputate
          lorem facilisis scelerisque leo mauris id. Ornare semper
          pharetra netus sodales bibendum. Ipsum orci amet sem egestas
          porta nunc facilisi felis ornare. Id nulla nisl nibh eu proin
          dignissim tincidunt. Arcu purus scelerisque amet vitae
          adipiscing feugiat tristique a nibh. Non nisi eu donec sodales.
          Sit sagittis lectus urna sit orci adipiscing enim est. Viverra
          turpis leo cursus diam.`,
  },
  {
    summary: 'Can I name my rover?',
    details: `Yes! You can personalize your rover by giving it a unique name,
                unless you’d like to refer to it as its initial serial-number.`,
  },
  {
    summary: 'Where can I find the serial number to my rover?',
    details: `When opening the settings in the application you will find the
                serial number to the rover you are currently connected to. If
                your user account has access to multiple rovers, the serial
                number for all rovers can be found on the connection page of the
                application.`,
  },
  {
    summary: 'What kind of environments can the Terra-X9 handle?',
    details: `The Terra-X9 is designed for all terrain and surfaces, it can
                withstand dust storms, extreme temperatures, and rocky
                landscapes.`,
  },
  {
    summary: 'Can I connect to multiple rovers?',
    details: `Yes, the app supports multi-rover management, allowing you to
                control and monitor multiple rovers, though not at the same
                time.`,
  },
];

const deliveryFAQ = [
  {
    summary: 'Why do I need a consultation before purchasing?',
    details: `A consultation ensures the Terra-X9 is customized to your
                company’s specific mission needs, ensuring that you make a
                confident and informed purchase, fully aligned with your goals.`,
  },
  {
    summary: 'How is the Terra-X9 delivered?',
    details: `The Terra-X9 is delivered via secure transport for
                interplanetary missions and conditions.`,
  },
  {
    summary: 'How long does it take to receive the rover after purchase?',
    details:
      'Delivery typically takes 6-12 weeks, depending on mission requirements.',
  },
  {
    summary: 'What kind of support do I get after purchase?',
    details: `You can reach out to us anytime through our support page on the
                product website, where we’re always ready to assist you.
                Additionally, the rover’s instruction manual is available for
                download on the same page whenever you need it.`,
  },
  {
    summary: 'What is your order cancellation policy?',
    details: `The Terra-X9 comes with a standard 24-month warranty covering
                hardware defects and software support. Extended warranties are
                also available.`,
  },
  {
    summary: 'Is there a warranty included when I purchase a Terra-X9?',
    details: `Yes, the Terra-X9 comes with a standard 24-month warranty
                covering hardware defects and software support. Extended
                warranties are also available.`,
  },
];

const FAQ = { applicationFAQ, deliveryFAQ };

export default FAQ;

export const INITIAL_FORM_DATA = {
  f_name_input: '',
  s_name_input: '',
  email_input: '',
  serial_input: '',
  issue_category_input: 'Select an option',
  issue_description_input: '',
  date_input: '',
  fileUploads: {
    loading: false,
    files: [],
  },
};

export const INITIAL_FORM_VALIDITY = {
      f_name_input: '',
      s_name_input: '',
      email_input: '',
      serial_input: '',
      issue_category_input: '',
      issue_description_input: '',
      date_input: '',
}