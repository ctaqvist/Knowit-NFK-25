// General structure of backend API response
export type ApiResponse<T> = {
  data: T;
  message?: string;
} | {
  data: null;
  error: string;
  message: string
}

export interface Review {
  content: string;
  client: string;
}

// Pages is the type definition for an object containing all pages
export interface Pages {
  hero: HeroPage,
  product: ProductPage,
  support: SupportPage
}
// Page is the type definition of one of the pages
export type Page = HeroPage | ProductPage | SupportPage

// Type for Hero Page data
export interface HeroPage {
  banner: {
    heading: {
      label: 'Page Title';
      type: 'input:text';
      value: string;
      minLength: 15,
      maxLength: 100
    };
    subheading: {
      label: 'Subheading';
      type: 'input:textarea';
      value: string;
      minLength: 15,
      maxLength: 500
    };
    banner: {
      // Media referrs to image or video format
      type: 'upload:media',
      filePath: string
    }
  };
}

// Type for Product Page data
export interface ProductPage {
  features: {
    type: 'input:text';
    value: string;
    minLength: number;
    maxLength: number;
  }[];
  statistics: {
    sun: {
      label: 'Statistic 1';
      value: string;
      type: 'input:text';
    };
    planet1: {
      label: 'Statistic 2';
      value: string;
      type: 'input:text';
    };
    planet2: {
      label: 'Statistic 3';
      value: string;
      type: 'input:text';
    };
    planet3: {
      label: 'Statistic 4';
      value: string;
      type: 'input:text';
    };
    planet4: {
      label: 'Statistic 5';
      value: string;
      type: 'input:text';
    };
  };
  gallery: {
    type: 'img' | 'video',
    width: number,
    height: number,
    filePath: string
  }[];
  manual: {
    label: '"TERRA-X9 Instruction Manual"';
    filepath: string;
  };
}

// Type for Support Page Data
export interface SupportPage {
  manuals: {
    instructionManual: {
      label: 'Instruction Manual';
      filePath: string;
      input: 'upload:document'
    },
    GPSR: {
      label: 'General Product Safety Regulation';
      filePath: string;
      input: 'upload:document'
    }
  },
  FAQ: {
    categoryName: string;
    data: {
      question: string;
      answer: string;
    }[];
  }[],
}
export interface ContactForm {
  firstName: string,
  surName: string,
  companyName: string,
  email: string,
  telephone: Telephone,
  businessField: string,
  message: string,
  booking: null | {
    date: string
    time: string
  }
}

type Telephone = CountryType & {
  number: string
}

export interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
  isSearchField?: boolean
}