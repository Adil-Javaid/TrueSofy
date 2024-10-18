export interface TeamLead {
  _id: string;
  username: string;
}

export interface Workspace {
  _id: string;
  name: string;
  teamLead?: TeamLead;
}

export interface Task {
  _id: string;
  description: string;
  status: string;
  deadline: string;
  workspace: {
    name: string;
  };
}


export interface User {
  _id: string;
  username: string;
}
