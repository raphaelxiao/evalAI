import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Slider,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// 每个目标的评分参考标准
const scoreReferenceByGoal = {
  capability: [
    { score: 1, description: '这项任务非常有助于提升我的能力和技能' },
    { score: 2, description: '这项任务有助于提升我的能力和技能' },
    { score: 3, description: '这项任务在能力提升方面影响一般' },
    { score: 4, description: '这项任务对能力提升帮助较小' },
    { score: 5, description: '这项任务对能力提升几乎没有帮助' }
  ],
  performance: [
    { score: 1, description: '这项任务不需要特别出色的表现' },
    { score: 2, description: '这项任务表现一般即可' },
    { score: 3, description: '这项任务需要较好的表现' },
    { score: 4, description: '这项任务需要出色的表现' },
    { score: 5, description: '这项任务需要极其出色的表现' }
  ],
  time: [
    { score: 1, description: '这项任务时间充裕，不需要节省时间' },
    { score: 2, description: '这项任务有足够时间完成' },
    { score: 3, description: '这项任务时间有限，需要一定效率' },
    { score: 4, description: '这项任务时间紧张，需要高效完成' },
    { score: 5, description: '这项任务时间非常紧迫，必须最大程度节省时间' }
  ]
};

// 分数参考标准（通用）
const scoreReference = [
  { score: 1, description: '任务非常简单，人工完成效率更高' },
  { score: 2, description: '任务较为简单，人工完成有优势' },
  { score: 3, description: '任务适中，人工与AI各有优势' },
  { score: 4, description: '任务较为复杂，AI有一定优势' },
  { score: 5, description: '任务非常复杂，AI具有明显优势' }
];

// AI采用程度参考
const aiAdoptionReference = [
  { min: 1.0, max: 1.8, adoption: '0-20%', description: '主要依靠人工，AI辅助少量工作' },
  { min: 1.8, max: 2.6, adoption: '20-40%', description: '人工为主，AI辅助部分工作' },
  { min: 2.6, max: 3.4, adoption: '40-60%', description: '人工与AI协作，各负责相近比例工作' },
  { min: 3.4, max: 4.2, adoption: '60-80%', description: 'AI为主，人工审核与调整' },
  { min: 4.2, max: 5.0, adoption: '80-100%', description: '主要依靠AI，人工极少干预' }
];

// 目标默认值 - 现在固定为三个特定目标
const defaultGoals = [
  { id: 1, name: '提高能力', weight: 50, score: 1, tooltip: '越可以提高能力的，AI采用分越低', type: 'capability' },
  { id: 2, name: '出色表现', weight: 30, score: 4, tooltip: '越需要出色表现的，AI采用分越高', type: 'performance' },
  { id: 3, name: '节省时间', weight: 20, score: 5, tooltip: '越需要节省时间的，AI采用分越高', type: 'time' }
];

interface AIAdoptionCalculatorProps {
  isMobile: boolean;
}

const AIAdoptionCalculator: React.FC<AIAdoptionCalculatorProps> = ({ isMobile }) => {
  const theme = useTheme();
  const [goals, setGoals] = useState(defaultGoals);
  const [weightTotal, setWeightTotal] = useState(100);
  const [weightError, setWeightError] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [aiAdoptionLevel, setAiAdoptionLevel] = useState('');
  const [tooltipOpen, setTooltipOpen] = useState<number | null>(null);

  // 计算加权平均分
  useEffect(() => {
    if (goals.length === 0) {
      setFinalScore(0);
      setAiAdoptionLevel('');
      return;
    }

    const weightedSum = goals.reduce((sum, goal) => sum + (goal.weight / 100) * goal.score, 0);
    setFinalScore(Number(weightedSum.toFixed(1)));

    // 确定AI采用程度级别
    const level = aiAdoptionReference.find(
      level => finalScore >= level.min && finalScore <= level.max
    );
    setAiAdoptionLevel(level ? level.adoption : '');
  }, [goals, finalScore]);

  // 计算权重总和并验证
  useEffect(() => {
    const total = goals.reduce((sum, goal) => sum + goal.weight, 0);
    setWeightTotal(total);
    setWeightError(total !== 100);
  }, [goals]);

  // 更新目标权重
  const handleWeightChange = (id: number, weight: number) => {
    setGoals(goals.map(goal => (goal.id === id ? { ...goal, weight } : goal)));
  };

  // 更新目标分数
  const handleScoreChange = (id: number, score: number) => {
    setGoals(goals.map(goal => (goal.id === id ? { ...goal, score } : goal)));
  };

  // 处理信息图标点击
  const handleInfoClick = (id: number) => {
    if (tooltipOpen === id) {
      setTooltipOpen(null);
    } else {
      setTooltipOpen(id);
    }
  };

  // 重置所有数据
  const handleReset = () => {
    setGoals(defaultGoals);
  };

  // 格式化分数显示
  const formatScore = (value: number) => {
    return `${value}`;
  };

  return (
    <Box>
      {/* 目标设置部分 */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">目标设置</Typography>
        </Box>
        
        <Typography variant="body2" color={weightError ? 'error' : 'text.secondary'} sx={{ mb: 2 }}>
          {weightError 
            ? `权重总和: ${weightTotal}% (应为100%)`
            : `权重总和: ${weightTotal}%`
          }
        </Typography>

        <TableContainer 
          component={Paper} 
          variant="outlined" 
          sx={{ 
            overflowX: 'hidden', // 隐藏水平滚动条
          }}
        >
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>目标名称</TableCell>
                <TableCell align="center">权重 (%)</TableCell>
                <TableCell align="center">评分 (1-5)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {goals.map((goal) => (
                <TableRow key={goal.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {goal.name}
                      <InfoIcon 
                        fontSize="small" 
                        color="primary" 
                        sx={{ ml: 1, cursor: 'pointer' }} 
                        onClick={() => handleInfoClick(goal.id)}
                      />
                      {isMobile && tooltipOpen === goal.id && (
                        <Dialog open={tooltipOpen === goal.id} onClose={() => setTooltipOpen(null)}>
                          <DialogTitle>{goal.name}</DialogTitle>
                          <DialogContent>
                            <Typography>{goal.tooltip}</Typography>
                          </DialogContent>
                        </Dialog>
                      )}
                      {!isMobile && (
                        <Tooltip
                          title={goal.tooltip}
                          open={tooltipOpen === goal.id}
                          onClose={() => setTooltipOpen(null)}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          placement="right"
                        >
                          <span></span>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: isMobile ? '80px' : '120px' }}>
                    <TextField
                      type="number"
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0, max: 100 }}
                      value={goal.weight}
                      onChange={(e) => handleWeightChange(goal.id, parseInt(e.target.value) || 0)}
                      error={weightError}
                      sx={{ width: isMobile ? '60px' : '80px' }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: isMobile ? '100px' : '150px' }}>
                    <Slider
                      value={goal.score}
                      onChange={(_, value) => handleScoreChange(goal.id, value as number)}
                      step={1}
                      marks
                      min={1}
                      max={5}
                      valueLabelDisplay="auto"
                      valueLabelFormat={formatScore}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 结果展示部分 */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>评估结果</Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'center' : 'flex-start',
          mb: 2
        }}>
          <Card sx={{ minWidth: 200, mb: isMobile ? 2 : 0 }}>
            <CardContent>
              <Typography variant="h5" component="div" color="primary" align="center">
                {finalScore.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                加权平均分
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h5" component="div" color="secondary" align="center">
                {aiAdoptionLevel}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                建议AI采用程度
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        {finalScore > 0 && (
          <Typography variant="body1">
            {aiAdoptionReference.find(
              level => finalScore >= level.min && finalScore <= level.max
            )?.description || ''}
          </Typography>
        )}
      </Paper>

      {/* 评分参考标准部分 */}
      <Box sx={{ mb: 3 }}>
        {/* 提高能力评分标准 */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>提高能力 - 评分参考标准</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">分数</TableCell>
                    <TableCell>描述</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scoreReferenceByGoal.capability.map((item) => (
                    <TableRow key={item.score}>
                      <TableCell align="center">{item.score}</TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
        
        {/* 出色表现评分标准 */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>出色表现 - 评分参考标准</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">分数</TableCell>
                    <TableCell>描述</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scoreReferenceByGoal.performance.map((item) => (
                    <TableRow key={item.score}>
                      <TableCell align="center">{item.score}</TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
        
        {/* 节省时间评分标准 */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>节省时间 - 评分参考标准</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">分数</TableCell>
                    <TableCell>描述</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scoreReferenceByGoal.time.map((item) => (
                    <TableRow key={item.score}>
                      <TableCell align="center">{item.score}</TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
        
        {/* AI采用程度参考 */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>AI采用程度参考</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <TableCell>分数范围</TableCell>
                    <TableCell>AI采用程度</TableCell>
                    <TableCell>描述</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {aiAdoptionReference.map((item) => (
                    <TableRow key={item.min}>
                      <TableCell>{item.min} - {item.max}</TableCell>
                      <TableCell>{item.adoption}</TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default AIAdoptionCalculator; 