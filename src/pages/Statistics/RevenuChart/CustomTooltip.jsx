import { formatMoney } from '@utils'

const CustomTooltip = (props) => {
  const { active, payload } = props
  if (active && payload && payload.length) {
    return (
      <div style={{ background: payload[0].color, color: 'white', padding: '10px', borderRadius: '6px' }}>
        <p className="label">{`${payload[0]?.payload?.name}: ${formatMoney(payload[0]?.value)} DA`}</p>
      </div>
    )
  }
  return null
}

export default CustomTooltip
