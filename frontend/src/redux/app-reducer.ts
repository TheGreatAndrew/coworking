// declare type. app reducer. 

type AppState = {
  inChannel: boolean;
  allGroups: [];
  joinedGroups: [];
  messages: [];
  members: [];
  groups: [];
  currentGroup: null;
  modal: null | 'bug' | 'edit' | 'create' | 'forrest';
  groupModal : null | 'group';
  forrest : 0;
};

type AppAction = {
  type: string;
  payload: {
    allGroups: [];
    joinedGroups: [];
    messages: [];
    members: [];
    groups: [];
    currentGroup: {};
    modal: null | 'bug' | 'edit' | 'create' | 'forrest';
    groupModal : null | 'group';
    forrest : 0;
  };
};

const initialState: AppState = {
  inChannel: false,
  messages: [],
  members: [],
  allGroups: [],
  joinedGroups: [],
  groups: [],
  currentGroup: null,
  modal: null,
  groupModal: null,
  forrest: 0
};

const reducer = (state = initialState, action: AppAction) => {
  switch (action.type) {
    case 'CHANGE GROUP':
      return { ...state, currentGroup: action.payload.currentGroup, inChannel: true };

    case 'SEARCH':
      return { ...state, allGroups: action.payload.allGroups };

    case 'FETCH ALL GROUPS':
      return { ...state, allGroups: action.payload.allGroups, groups: action.payload.groups };

    case 'FETCH JOINED GROUPS':
      return { ...state, joinedGroups : action.payload.joinedGroups };
  
    case 'FETCH MESSAGES':
      return { ...state, messages: action.payload.messages, members: action.payload.members };

    case 'MODAL':
      return { ...state, modal: action.payload.modal };

    case 'GROUP MODAL':
      return { ...state, groupModal: action.payload.groupModal };  

    // TODO : change currentGroup to currentGroup.title
    case 'GROUP EDIT':
      return { ...state, currentGroup: action.payload.currentGroup };  

    case 'FETCH FORREST':
      return { ...state, forrest : action.payload.forrest}

    case 'EXIT':
      return {
        ...state,
        inChannel: false,
        currentGroup: null,
        allGroups: state.groups,
        members: [],
        messages: []
      };

    default:
      return state;
  }
};

export default reducer;
