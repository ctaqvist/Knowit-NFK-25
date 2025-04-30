// General structure of backend API response
export interface ApiResponse<T> {
  data: T;
  error: null | string;
  message?: string;
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
    planet0: {
      label: 'Statistic 1';
      statistic_heading: string;
      statistic_detail: string;
      type: 'input:text';
    };
    planet1: {
      label: 'Statistic 2';
      statistic_heading: string;
      statistic_detail: string;
      type: 'input:text';
    };
    planet2: {
      label: 'Statistic 3';
      statistic_heading: string;
      statistic_detail: string;
      type: 'input:text';
    };
    planet3: {
      label: 'Statistic 4';
      statistic_heading: string;
      statistic_detail: string;
      type: 'input:text';
    };
    planet4: {
      label: 'Statistic 5';
      statistic_heading: string;
      statistic_detail: string;
      type: 'input:text';
    };
  };
  gallery: {
    position: number
    type: 'img' | 'video',
    filePath: string,
    recommended_apsect_ratio: string
  }[];
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
