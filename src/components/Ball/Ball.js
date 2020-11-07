import { RED, MINT_GREEN } from '../../constants/colors';

const renderBall = (context, radius, position) => {
  const { x, y } = position;
  const gradient = context.createLinearGradient(0, 0, 750, 200, 30, 30);
  gradient.addColorStop(0, MINT_GREEN);
  gradient.addColorStop(1, RED);
  context.save();
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, false);
  context.fill();
  context.restore();
};

export default renderBall;
