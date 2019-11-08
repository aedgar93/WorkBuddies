const BATCH_LIMIT = 25;

function* asyncCursorIterator(firestoreQuery) {
  let last;
  let more = true;
  let cursor;
  while (more) {
    cursor = last
      ? firestoreQuery.startAt(last).limit(BATCH_LIMIT)
      : firestoreQuery.limit(BATCH_LIMIT);
    yield cursor
      .get()
      // eslint-disable-next-line no-loop-func
      .then(snapshots => {
        if (snapshots.docs.length < BATCH_LIMIT) more = false;
        return snapshots.docs.map(d => ({
          path: d.ref.path,
          id: d.id,
          data: d.data()
        }));
      });
  }
}

function asyncMap(asyncIterable, cb) {
  function asyncStepper(resolve) {
    let ret = asyncIterable.next();
    if (!ret.done) {
      return ret.value.then(res => {
        cb(res);
        return asyncStepper(resolve);
      });
    }
    else return resolve();
  }
  return new Promise(res => asyncStepper(res));
}

module.exports = function (firestore) {
  const companyRef = firestore.collection('companies');
  const queryField = field => (start) => {
    return companyRef
      .where(field, '<=', start)
  };

  return {
    getToMatchUp: (start) => ({
      asyncMap: asyncMap.bind(null, asyncCursorIterator(queryField('matchUpTime')(start)))
    }),
  };
};
