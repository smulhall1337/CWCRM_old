package com.cedarwoods.crm.service.impl;

import com.cedarwoods.crm.service.PriorityService;
import com.cedarwoods.crm.domain.Priority;
import com.cedarwoods.crm.repository.PriorityRepository;
import com.cedarwoods.crm.repository.search.PrioritySearchRepository;
import com.cedarwoods.crm.service.dto.PriorityDTO;
import com.cedarwoods.crm.service.mapper.PriorityMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Priority.
 */
@Service
@Transactional
public class PriorityServiceImpl implements PriorityService {

    private final Logger log = LoggerFactory.getLogger(PriorityServiceImpl.class);

    private final PriorityRepository priorityRepository;

    private final PriorityMapper priorityMapper;

    private final PrioritySearchRepository prioritySearchRepository;

    public PriorityServiceImpl(PriorityRepository priorityRepository, PriorityMapper priorityMapper, PrioritySearchRepository prioritySearchRepository) {
        this.priorityRepository = priorityRepository;
        this.priorityMapper = priorityMapper;
        this.prioritySearchRepository = prioritySearchRepository;
    }

    /**
     * Save a priority.
     *
     * @param priorityDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public PriorityDTO save(PriorityDTO priorityDTO) {
        log.debug("Request to save Priority : {}", priorityDTO);

        Priority priority = priorityMapper.toEntity(priorityDTO);
        priority = priorityRepository.save(priority);
        PriorityDTO result = priorityMapper.toDto(priority);
        prioritySearchRepository.save(priority);
        return result;
    }

    /**
     * Get all the priorities.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<PriorityDTO> findAll() {
        log.debug("Request to get all Priorities");
        return priorityRepository.findAll().stream()
            .map(priorityMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one priority by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<PriorityDTO> findOne(Long id) {
        log.debug("Request to get Priority : {}", id);
        return priorityRepository.findById(id)
            .map(priorityMapper::toDto);
    }

    /**
     * Delete the priority by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Priority : {}", id);
        priorityRepository.deleteById(id);
        prioritySearchRepository.deleteById(id);
    }

    /**
     * Search for the priority corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<PriorityDTO> search(String query) {
        log.debug("Request to search Priorities for query {}", query);
        return StreamSupport
            .stream(prioritySearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .map(priorityMapper::toDto)
            .collect(Collectors.toList());
    }
}
