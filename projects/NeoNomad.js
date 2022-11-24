const { getTokenAccountBalance } = require('./helper/solana')
const { get } = require('./helper/http')
let _lpData

async function getLPData() {
  if (!_lpData) _lpData = get("https://api.raydium.io/pairs")
  return _lpData
}

async function tvl() {
  const LP_Data = await getLPData()
  const pools = [
    {
      name: 'NNI-USDC',
      mint: '3yQY6HfoZg9drucJAx86zWjKrqvEywxRFp3WtHFjLV5S',
      tokenAccount: 'JAvMHPyxwDauikMMjL7J2yoEyr5EB3rj5xaAF8QiFdY',
    },
  ]
  let total = 0
  for (const { mint, tokenAccount } of pools) {
    const lpPrice = LP_Data.find(i => i.lp_mint === '3yQY6HfoZg9drucJAx86zWjKrqvEywxRFp3WtHFjLV5S')?.lp_price || 0
    const stakedLP = await getTokenAccountBalance('JAvMHPyxwDauikMMjL7J2yoEyr5EB3rj5xaAF8QiFdY')
    total += lpPrice * stakedLP
  }
  return {
    'tether': total
  };
}

async function staking() {
  const LP_Data = await getLPData()
  const Price = LP_Data.find(i => i.lp_mint === '3yQY6HfoZg9drucJAx86zWjKrqvEywxRFp3WtHFjLV5S').price
  const stakedLP = await getTokenAccountBalance('35shqcqSGRhZZ4DtsdsgEFn6F5JKkf3xyVLkJnLu8mmb')
  return {
    'tether': Price * stakedLP
  };
}


module.exports = {
  timetravel: false,
  solana: {
    tvl,
    staking,
  },
}
