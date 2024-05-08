const CustomTooltip = (props) => {
  const { active, payload } = props
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'white',
          color: payload[0].payload.fill,
          fontWeight: 'bold',
          padding: '6px',
          borderRadius: '6px',
        }}>
        <p className="label">{payload[0]?.value} patients</p>
      </div>
    )
  }
  return null
}

export default CustomTooltip
