const { getResponse } = require("../actions/runQnaChain");

async function getAnswerOfQuery(req, res) {
  // console.log(req.body);
  const { query } = req.body;
  // console.log("Query: ", query);
  const answer = await getResponse(query);

  return res.status(200).json({
    success: true,
    data: answer?.text,
  });
}

module.exports = { getAnswerOfQuery };
