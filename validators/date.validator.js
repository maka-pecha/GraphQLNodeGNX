const gnx = require('@simtlix/gnx');
const GNXError = gnx.GNXError;

const CantSetEndDateLessThanStartDate ={
  validate: async function(typeName, originalObject, materializedObject) {
    if (materializedObject.toDate <= materializedObject.fromDate) {
      throw new CantSetEndDateLessThanStartDateError(typeName, 'from_date must be smaller than to_date');
    }
  }
};

class CantSetEndDateLessThanStartDateError extends GNXError {
  constructor(typeName, message) {
    super(typeName, message, 'CantSetEndDateLessThanStartDateError');
  }
}

module.exports ={ CantSetEndDateLessThanStartDate };