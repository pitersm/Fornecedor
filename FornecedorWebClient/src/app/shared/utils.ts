export function isValidCNPJ(cnpj): boolean {
  if (!cnpj) {
    return true;
  }

  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj === '') {
    return false;
  }

  if (cnpj.length !== 14) {
    return false;
  }

  if (cnpj === '00000000000000' ||
    cnpj === '11111111111111' ||
    cnpj === '22222222222222' ||
    cnpj === '33333333333333' ||
    cnpj === '44444444444444' ||
    cnpj === '55555555555555' ||
    cnpj === '66666666666666' ||
    cnpj === '77777777777777' ||
    cnpj === '88888888888888' ||
    cnpj === '99999999999999') {
    return false;
  }

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result.toString() !== digits.charAt(0)) {
    return false;
  }

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result.toString() !== digits.charAt(1)) {
    return false;
  }

  return true;
}

export function isValidCpf(cpf: string): boolean {
  if (!cpf) {
    return true;
  }

  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11) {
      return false;
  }
  if ((cpf === '00000000000')
  || (cpf === '11111111111')
  || (cpf === '22222222222')
  || (cpf === '33333333333')
  || (cpf === '44444444444')
  || (cpf === '55555555555')
  || (cpf === '66666666666')
  || (cpf === '77777777777')
  || (cpf === '88888888888')
  || (cpf === '99999999999')) {
      return false;
  }

  let numberValue = 0;
  let character = '';
  const numbers = '0123456789';
  let j = 10;
  let sum = 0;
  let rest = 0;
  let digit1 = 0;
  let digit2 = 0;
  let cpfAux = '';
  cpfAux = cpf.substring(0, 9);

  for (let i = 0; i < 9; i++) {
      character = cpfAux.charAt(i);
      if (numbers.search(character) === -1) {
          return false;
      }
      numberValue = Number(character);
      sum = sum + (numberValue * j);
      j--;
  }

  rest = sum % 11;
  digit1 = 11 - rest;
  if (digit1 > 9) {
      digit1 = 0;
  }
  j = 11;
  sum = 0;
  cpfAux = cpfAux + digit1;

  for (let i = 0; i < 10; i++) {
      character = cpfAux.charAt(i);
      numberValue = Number(character);
      sum = sum + (numberValue * j);
      j--;
  }

  rest = sum % 11;
  digit2 = 11 - rest;
  if (digit2 > 9) {
      digit2 = 0;
  }

  cpfAux = cpfAux + digit2;
  if (cpf !== cpfAux) {
      return false;
  } else {
      return true;
  }
}

export function getAge(birthDate: Date) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}
