const { test, expect } = require('@playwright/test');
const AWS = require('aws-sdk');

const sns = new AWS.SNS({ region: 'sua-regiao-aqui' }); // Substitua com sua região

test('Publicação de Mensagem em Tópico SNS', async () => {
  // Substitua com o ARN do seu tópico SNS real
  const topicoArn = 'arn:aws:sns:sua-regiao-aqui:sua-conta-id:seu-topico';

  // Substitua com o texto esperado da mensagem
  const textoEsperado = 'Mensagem de Teste para o Tópico SNS';

  // Publica uma mensagem no tópico SNS
  const { MessageId } = await sns.publish({
    TopicArn: topicoArn,
    Message: textoEsperado,
  }).promise();

  // Verifica se a publicação foi bem-sucedida
  expect(MessageId).toBeDefined();

  // Verifica se o texto da mensagem é igual ao texto esperado
  const { Messages } = await sns.receiveMessage({
    QueueUrl: filaUrl,
    MaxNumberOfMessages: 1,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0,
  }).promise();

  expect(Messages).toBeDefined();

  if (Messages && Messages.length > 0) {
    expect(Messages[0].Body).toContain(textoEsperado);
  } else {
    // Caso não haja mensagens, isso indica um problema na publicação
    throw new Error('A mensagem não foi recebida na fila associada ao tópico SNS.');
  }
});
