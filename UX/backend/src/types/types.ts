export interface ApiResponse<T> {
  data: T,
  error: null | string
}

export type ReviewWithClient = {
  content: string;
  clients: {
    company_name: string;
  }[]; // now accepts array of clients
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

export interface FormattedPageData {
  name: string,
  content: object
}