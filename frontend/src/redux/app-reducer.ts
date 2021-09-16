// declare type. app reducer. 

type AppState = {
  inChannel: boolean;
  displayedGroups: [];
  messages: [];
  members: [];
  groups: [];
  currentGroup: null;
  modal: null | 'bug' | 'edit' | 'create' | 'forrest';
  forrest : 0;
};

type AppAction = {
  type: string;
  payload: {
    displayedGroups: [];
    messages: [];
    members: [];
    groups: [];
    currentGroup: {};
    modal: null | 'bug' | 'edit' | 'create' | 'forrest';
    forrest : 0;
  };
};

const initialState: AppState = {
  inChannel: false,
  messages: [],
  members: [],
  displayedGroups: [],
  groups: [],
  currentGroup: null,
  modal: null,
  forrest: 0
};

const reducer = (state = initialState, action: AppAction) => {
  switch (action.type) {
    case 'CHANGE GROUP':
      return { ...state, currentGroup: action.payload.currentGroup, inChannel: true };

    case 'SEARCH':
      return { ...state, displayedGroups: action.payload.displayedGroups };

    case 'FETCH GROUPS':
      return { ...state, displayedGroups: action.payload.displayedGroups, groups: action.payload.groups };

    case 'FETCH MESSAGES':
      return { ...state, messages: action.payload.messages, members: action.payload.members };

    case 'MODAL':
      return { ...state, modal: action.payload.modal };

    case 'FETCH FORREST':
      return { ...state, forrest : action.payload.forrest}

    case 'EXIT':
      return {
        ...state,
        inChannel: false,
        currentGroup: null,
        displayedGroups: state.groups,
        members: [],
        messages: []
      };

    default:
      return state;
  }
};

export default reducer;
