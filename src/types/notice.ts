export type Priority = 'High' | 'Medium' | 'Low';

export type Department =
  | 'Computer Science and Engineering (CSE)'
  | 'Information Technology (IT)'
  | 'Electronics and Communication Engineering (ECE)'
  | 'Electrical and Electronics Engineering (EEE)'
  | 'Mechanical Engineering (ME)'
  | 'Civil Engineering'
  | 'General / All Departments';

export type Category =
  | 'Academic'
  | 'Examination'
  | 'Placement & Training'
  | 'Sports & Cultural'
  | 'Administrative'
  | 'Hostel & Transport';

export interface Notice {
  id: string;
  title: string;
  description: string;
  department: Department;
  category: Category;
  priority: Priority;
  publishedDate: string; // ISO string
  expiryDate?: string | null; // ISO string
  publisherName: string;
}

export type SortOrder = 'newest' | 'oldest';

export type ScreenName =
  | 'home'
  | 'detail'
  | 'create'
  | 'departments'
  | 'settings';
