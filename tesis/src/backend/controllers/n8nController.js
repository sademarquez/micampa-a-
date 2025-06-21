const redis = require('../config/redis');

class N8NController {
  async listWorkflows(req, res) {
    try {
      // Simular lista de workflows
      const workflows = [
        { id: 1, name: 'Sincronización de Voluntarios', status: 'active', lastRun: '2024-06-15T10:00:00Z' },
        { id: 2, name: 'Envío Masivo de Mensajes', status: 'active', lastRun: '2024-06-15T12:00:00Z' },
        { id: 3, name: 'Análisis de KPIs', status: 'inactive', lastRun: '2024-06-14T18:00:00Z' }
      ];
      res.json({ success: true, data: workflows });
    } catch (error) {
      console.error('Error en listar workflows de n8n:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async runWorkflow(req, res) {
    try {
      const { workflowId } = req.params;
      // Simular ejecución de workflow
      const result = {
        workflowId,
        status: 'success',
        startedAt: new Date().toISOString(),
        finishedAt: new Date(Date.now() + 5000).toISOString(),
        output: { message: 'Workflow ejecutado correctamente', data: {} }
      };
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error en ejecutar workflow de n8n:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getWorkflowResult(req, res) {
    try {
      const { workflowId } = req.params;
      // Simular resultado de workflow
      const result = {
        workflowId,
        status: 'success',
        startedAt: '2024-06-15T10:00:00Z',
        finishedAt: '2024-06-15T10:00:05Z',
        output: { message: 'Resultado simulado', data: { example: 123 } }
      };
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error en obtener resultado de workflow de n8n:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new N8NController(); 