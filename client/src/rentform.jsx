import React, { useState } from 'react';
import jsPDF from 'jspdf';

const StyledInput = ({ ...props }) => (
  <input
    {...props}
    style={{
      border: '2px solid #CA5010',
      borderRadius: '20px',
      padding: '7px 10px',
      outline: 'none',
      fontSize: '1rem',
      marginLeft: '2px',
      ...props.style,
    }}
  />
);

const RentForm = () => {
  const [form, setForm] = useState({
    name: '',
    rentUnit: '',
    rentMonth: '',
    date: '',
    rentPrice: ''
  });
  const isFormComplete = Object.values(form).every(v => v && v.trim() !== '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // PDF generation logic
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(18);
    doc.text('Recibo de recebimento de aluguel', 20, 20);
    doc.setFontSize(12);
    let y = 40;
    doc.text(`Nome do locatário: ${form.name}`, 20, y);
    y += 10;
    doc.text(`Unidade de locação: ${form.rentUnit}`, 20, y);
    y += 10;
    doc.text(`Mês de locação: ${form.rentMonth}`, 20, y);
    y += 10;
    doc.text(`Data de pagamento: ${form.date}`, 20, y);
    y += 10;
    // Calculate values
    const price = parseFloat(form.rentPrice.replace(/[^\d.]/g, '')) || 0;
    const valorAluguel = (price * 0.7).toFixed(2);
    const despesasCondominio = (price * 0.3).toFixed(2);
    doc.text(`Valor do aluguel: R$ ${valorAluguel}`, 20, y);
    y += 10;
    doc.text(`Despesas do condomínio: R$ ${despesasCondominio}`, 20, y);
    y += 20;
  doc.text('Assinatura: ___________________________', 20, y);
  // Format file name
  const nome = form.name ? form.name.replace(/[^A-Za-zÀ-ÿ'\-\s]/g, '').replace(/\s+/g, '_') : 'locatario';
  const unidade = form.rentUnit ? form.rentUnit.replace(/[^A-Za-zÀ-ÿ0-9'\-\s]/g, '').replace(/\s+/g, '_') : 'unidade';
  const mes = form.rentMonth ? form.rentMonth.replace(/[^\w-]/g, '_') : 'mes';
  doc.save(`Recibo_${nome}_${unidade}_${mes}.pdf`);
    // Optionally, keep backend logic
    try {
      const response = await fetch('https://geracao-de-recibos-de-aluguel.onrender.com/api/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();
  alert(result.message);
    } catch (error) {
      alert('Error submitting form: ' + error);
    }
  };

  return (
  <form onSubmit={handleSubmit} style={{ maxWidth: 400, marginLeft: '10vw', textAlign: 'left' }}>
      <h2 style={{ color: '#CA5010', marginBottom: '50px' }}>Gerar recibo de aluguel</h2>
      <div style={{ padding: '5px 0' }}>
        <label style={{ color: '#4F4D4C', marginRight: '4px' }}>Nome do locatário:</label>
        <StyledInput
          type="text"
          name="name"
          value={form.name}
          onChange={e => {
            const value = e.target.value;
            // Only allow letters, apostrophe, and hyphen
            if (/^[A-Za-zÀ-ÿ'\-\s]*$/.test(value)) {
              setForm({ ...form, name: value });
            }
          }}
          required
        />
      </div>
      <div style={{ padding: '5px 0' }}>
        <label style={{ color: '#4F4D4C', marginRight: '4px' }}>Unidade de locação:</label>
        <StyledInput type="text" name="rentUnit" value={form.rentUnit} onChange={handleChange} required />
      </div>
      <div style={{ padding: '5px 0' }}>
        <label style={{ color: '#4F4D4C', marginRight: '4px' }}>Mês de locação:</label>
        <StyledInput type="month" name="rentMonth" value={form.rentMonth} onChange={handleChange} required />
      </div>
      <div style={{ padding: '5px 0' }}>
        <label style={{ color: '#4F4D4C', marginRight: '4px' }}>Data de pagamento:</label>
        <StyledInput type="date" name="date" value={form.date} onChange={handleChange} required />
      </div>
      <div style={{ padding: '5px 0', display: 'flex', alignItems: 'center' }}>
        <label style={{ color: '#4F4D4C', marginRight: '4px' }}>Valor do aluguel:</label>
        <div style={{ position: 'relative', width: '140px' }}>
          <StyledInput
            type="text"
            name="rentPrice"
            value={form.rentPrice ? `R$ ${form.rentPrice}` : ''}
            onChange={e => {
              let value = e.target.value.replace(/[^\d.,]/g, '');
              value = value.replace(',', '.');
              // Only allow positive numbers with up to 2 decimals
              if (/^\d*(\.\d{0,2})?$/.test(value)) {
                setForm({ ...form, rentPrice: value });
              }
            }}
            required
            min="0"
            style={{ paddingRight: '2px', width: '140px' }}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!isFormComplete}
        style={{
          backgroundColor: isFormComplete ? '#CA5010' : '#ccc',
          color: '#fff',
          border: 'none',
          borderRadius: '25px',
          padding: '12px 32px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: isFormComplete ? 'pointer' : 'not-allowed',
          marginTop: '50px',
          boxShadow: isFormComplete ? '0 2px 8px rgba(202, 80, 16, 0.15)' : 'none',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => { if(isFormComplete) e.currentTarget.style.backgroundColor = '#a63d00'; }}
        onMouseOut={e => { if(isFormComplete) e.currentTarget.style.backgroundColor = '#CA5010'; }}
      >
        Enviar
      </button>
    </form>
  );
};

export default RentForm;
