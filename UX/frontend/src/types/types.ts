export interface ApiResponse<T> {
  data: T,
  error: null | string
}

export interface PageData {
  name: string,
  content: PageContent,
  id: string
}

export type FormattedPageData = {
  [key: string]: {
    content: PageContent
  };
};

export interface PageContent {
  h1?: string
  h2?: string
  h3?: string
  h4?: string
  h5?: string
  h6?: string
  p?: string
}

export interface OriginalReview {
  content: any;
  clients: {
    company_name: any;
  };
};

export interface FormattedReview {
  content: string
  client: string
}


export interface Page {
  pageTitle: string,
  sections: {
    sectionHeader: Section[]
  }
}

export interface Section {
  editableFields: EditableField[]
}

export interface EditableField {
  [key: string]: {
    label: string,
    type: string,
    filePath?: string
  }
}