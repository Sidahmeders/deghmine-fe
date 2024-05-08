import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts'

import { WORK_LOAD_DATA } from '@fakeDB'

const parseDomain = () => [
  0,
  Math.max(
    Math.max.apply(
      null,
      WORK_LOAD_DATA.map((entry) => entry.value),
    ),
  ),
]

const renderTooltip = (props) => {
  const { active, payload } = props

  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload

    return (
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #999',
          margin: 0,
          padding: 10,
        }}>
        <p>{data.week} semaine</p>
        <p>{data.value} malade</p>
      </div>
    )
  }

  return null
}

const WorkLoadChart = () => {
  const domain = parseDomain()
  const range = [16, 225]

  return (
    <div style={{ overflowX: 'auto' }}>
      <ScatterChart width={2200} height={60} margin={{ top: 12 }}>
        <XAxis
          type="category"
          dataKey="week"
          name="week"
          interval={0}
          tick={{ fontSize: 0 }}
          tickLine={{ transform: 'translate(0, -6)' }}
        />
        <YAxis
          type="number"
          dataKey="index"
          height={10}
          width={80}
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: 'samedi', position: 'insideRight' }}
        />
        <ZAxis type="number" dataKey="value" domain={domain} range={range} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
        <Scatter data={WORK_LOAD_DATA} fill="#8884d8" />
      </ScatterChart>

      <ScatterChart width={2200} height={60} margin={{ top: 12 }}>
        <XAxis
          type="category"
          dataKey="week"
          interval={0}
          tick={{ fontSize: 0 }}
          tickLine={{ transform: 'translate(0, -6)' }}
        />
        <YAxis
          type="number"
          dataKey="index"
          name="dimanche"
          height={10}
          width={80}
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: 'dimanche', position: 'insideRight' }}
        />
        <ZAxis type="number" dataKey="value" domain={domain} range={range} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
        <Scatter data={WORK_LOAD_DATA} fill="#8884d8" />
      </ScatterChart>

      <ScatterChart width={2200} height={60} margin={{ top: 12 }}>
        <XAxis
          type="category"
          dataKey="week"
          name="week"
          interval={0}
          tick={{ fontSize: 0 }}
          tickLine={{ transform: 'translate(0, -6)' }}
        />
        <YAxis
          type="number"
          dataKey="index"
          height={10}
          width={80}
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: 'lundi', position: 'insideRight' }}
        />
        <ZAxis type="number" dataKey="value" domain={domain} range={range} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
        <Scatter data={WORK_LOAD_DATA} fill="#8884d8" />
      </ScatterChart>

      <ScatterChart width={2200} height={60} margin={{ top: 12 }}>
        <XAxis
          type="category"
          dataKey="week"
          name="week"
          interval={0}
          tick={{ fontSize: 0 }}
          tickLine={{ transform: 'translate(0, -6)' }}
        />
        <YAxis
          type="number"
          dataKey="index"
          height={10}
          width={80}
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: 'mardi', position: 'insideRight' }}
        />
        <ZAxis type="number" dataKey="value" domain={domain} range={range} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
        <Scatter data={WORK_LOAD_DATA} fill="#8884d8" />
      </ScatterChart>

      <ScatterChart width={2200} height={60} margin={{ top: 12 }}>
        <XAxis type="category" dataKey="week" name="week" interval={0} tickLine={{ transform: 'translate(0, -6)' }} />
        <YAxis
          type="number"
          dataKey="index"
          height={10}
          width={80}
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: 'mercredi', position: 'insideRight' }}
        />
        <ZAxis type="number" dataKey="value" domain={domain} range={range} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
        <Scatter data={WORK_LOAD_DATA} fill="#8884d8" />
      </ScatterChart>
    </div>
  )
}

export default WorkLoadChart
