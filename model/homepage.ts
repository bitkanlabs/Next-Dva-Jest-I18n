const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const model = {
  namespace: 'index',
  state    : {
    name : 'Bitkan',
    count: 0,
    init : false,
  },
  reducers : {
    calculate(state, payload) {
      const { count } = state;
      const { delta } = payload;
      return { ...state, count: count + delta };
    },
  },
  effects  : {
    * init(action, { put }) {
      yield delay(2000);
      yield put({ type: 'calculate', delta: 1 });
    },
  },
};

export default model;